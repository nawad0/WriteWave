using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;
using WriteWave.Application.Minio;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Infrastructure.Minio;

public class MinioService : IMinioService
{
    private readonly IMinioClient _minioClient;
    //private readonly string? _bucket = Accessor.AppConfiguration["Minio:Bucket"];
 
    private readonly string? _bucket = "writewave";

    private Task<bool> IsBucketExists() =>
        _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucket));

    private async Task<string> IsFileExists(string token)
    {
        var statObjectArgs = new StatObjectArgs()
            .WithBucket(_bucket)
            .WithObject(token);

        var status = await _minioClient.StatObjectAsync(statObjectArgs);
        if (status == null)
            throw new Exception("File not found or deleted");

        return status.ContentType;
    }

    public MinioService(IMinioClientFactory minioClientFactory)
    {
        _minioClient = minioClientFactory.CreateClient();
    }

    public async Task<string> PutObject(IFormFile file)
    {
        if (!await IsBucketExists())
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucket));
            
            var policy = @"{
                ""Version"": ""2012-10-17"",
                ""Statement"": [
                    {
                        ""Effect"": ""Allow"",
                        ""Principal"": ""*"",
                        ""Action"": [
                            ""s3:GetObject""
                        ],
                        ""Resource"": [
                            ""arn:aws:s3:::" + _bucket + @"/*""
                        ]
                    }
                ]
            }";
    
            await _minioClient.SetPolicyAsync(new SetPolicyArgs()
                .WithBucket(_bucket)
                .WithPolicy(policy));
        }

        

        var filestream = new MemoryStream(await file.GetBytes());
        var filename = Guid.NewGuid().ToString();

        try
        {
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucket)
                .WithObject(filename)
                .WithStreamData(filestream)
                .WithObjectSize(filestream.Length)
                .WithContentType(file.ContentType);

            await _minioClient.PutObjectAsync(putObjectArgs);
            return filename;
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine(e);
            throw;
        }
       
    }

    public async Task<GetObjectDto> GetObject(string token)
    {
        if (!await IsBucketExists())
            throw new Exception("NotFound");

        var contentType = await IsFileExists(token);

        var destination = new MemoryStream();

        var getObjectArgs = new GetObjectArgs()
            .WithBucket(_bucket)
            .WithObject(token)
            .WithCallbackStream((stream) => { stream.CopyTo(destination); });
        await _minioClient.GetObjectAsync(getObjectArgs);

        return new GetObjectDto()
        {
            Bytes = destination.ToArray(),
            ContentType = contentType
        };
    }
}

public static class FormFileExtensions
{
    public static async Task<byte[]> GetBytes(this IFormFile formFile)
    {
        await using var memoryStream = new MemoryStream();
        await formFile.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}