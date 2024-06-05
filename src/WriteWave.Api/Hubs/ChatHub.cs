using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Api.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageDTO mes);
        Task LoadMessages(List<MessageDTO> messages, string username);
        Task LoadChatsWithLatestMessages(List<ChatWithLatestMessageDTO> chats);
    }

    public class ChatHub : Hub<IChatClient>
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepository<UserChat> _userChatRepository;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(IRepository<UserChat> userChatRepository, IUserRepository userRepository, ILogger<ChatHub> logger)
        {
            _userChatRepository = userChatRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task JoinChat(UserConnection connection, int otherUserId)
        {
            try
            {
                var user = await _userRepository.GetAsync(u => u.UserId == connection.UserId);
                var otherUser = await _userRepository.GetAsync(u => u.UserId == otherUserId);
                if (user == null)
                {
                    _logger.LogWarning("User not found: {UserId}", connection.UserId);
                    throw new HubException("User not found");
                }
                
                var stringConnection = JsonSerializer.Serialize(connection);
                Context.Items["UserConnection"] = stringConnection;
                
                var chat = await _userChatRepository.GetAsync(c =>
                    (c.User1Id == connection.UserId && c.User2Id == otherUserId) ||
                    (c.User1Id == otherUserId && c.User2Id == connection.UserId), includeProperties: "Messages.Sender");

                if (chat == null)
                {
                    chat = new UserChat
                    {
                        User1Id = connection.UserId,
                        User2Id = otherUserId
                    };

                    await _userChatRepository.CreateAsync(chat);
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, chat.ChatId.ToString());
                
                List<MessageDTO> messages = new List<MessageDTO>();

                foreach (var mes in chat.Messages)
                {
                    MessageDTO newMessage = new MessageDTO
                    {
                        Message = mes.Content,
                        UserName = mes.Sender.Username,
                        SentAt = mes.SentAt,
                        UserImage = mes.Sender.Image
                    };
                    messages.Add(newMessage);
                }

                await Clients.Caller.LoadMessages(messages, otherUser.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in JoinChat");
                throw new HubException($"Error in JoinChat: {ex.Message}");
            }
        }

        public async Task SendMessage(int otherUserId, string message)
        {
            if (!Context.Items.TryGetValue("UserConnection", out var connectionObj))
            {
                throw new HubException("Connection not found");
            }

            var stringConnection = connectionObj as string;
            var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);
            if (connection == null)
            {
                throw new HubException("Connection not found");
            }
            
            var chat = await _userChatRepository.GetAsync(c =>
                (c.User1Id == connection.UserId && c.User2Id == otherUserId) ||
                (c.User1Id == otherUserId && c.User2Id == connection.UserId), includeProperties: "Messages.Sender");
            if (chat == null)
            {
                throw new HubException("Chat not found");
            }

            var privateMessage = new PrivateMessage
            {
                Content = message,
                SentAt = DateTime.UtcNow,
                SenderId = connection.UserId,
                ChatId = chat.ChatId
            };
            
            chat.Messages.Add(privateMessage);
            await _userChatRepository.UpdateAsync(chat);
            var user = await _userRepository.GetAsync(u => u.UserId == connection.UserId);
            var mes = new MessageDTO
            {
                Message = privateMessage.Content,
                UserName = connection.UserName,
                SentAt = privateMessage.SentAt,
                UserImage = user.Image
            };
          
            var receiverId = chat.User1Id == connection.UserId ? chat.User2Id : chat.User1Id;
            var receiver = await _userRepository.GetAsync(u => u.UserId == receiverId);

            if (receiver != null)
            {
                await Clients.Group(chat.ChatId.ToString()).ReceiveMessage(mes);
            }
        }
        
        public async Task GetAllChatsWithLatestMessages(int userId)
        {
            try
            {
                var chats = await _userChatRepository.GetAllAsync(c => c.User1Id == userId || c.User2Id == userId, includeProperties: "Messages.Sender");
                var chatDtos = new List<ChatWithLatestMessageDTO>();

                foreach (var chat in chats)
                {
                    var latestMessage = chat.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
                    if (latestMessage != null)
                    {
                        var otherUserId = chat.User1Id == userId ? chat.User2Id : chat.User1Id;
                        var otherUser = await _userRepository.GetAsync(u => u.UserId == otherUserId);
                        if (otherUser != null)
                        {
                            chatDtos.Add(new ChatWithLatestMessageDTO
                            {
                                ChatId = chat.ChatId,
                                UserId = otherUser.UserId,
                                UserName = otherUser.Username,
                                LatestMessage = latestMessage.Content,
                                LatestMessageSentAt = latestMessage.SentAt
                            });
                        }
                    }
                }

                await Clients.Caller.LoadChatsWithLatestMessages(chatDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllChatsWithLatestMessages");
                throw new HubException($"Error in GetAllChatsWithLatestMessages: {ex.Message}");
            }
        }

        public async Task CreatePrivateChat(int userId1, int userId2)
        {
            var chat = new UserChat
            {
                User1Id = userId1,
                User2Id = userId2
            };

            await _userChatRepository.CreateAsync(chat);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.Items.TryGetValue("UserConnection", out var connectionObj))
            {
                var stringConnection = connectionObj as string;
                var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);
                if (connection != null)
                {
                    Context.Items.Remove("UserConnection");
                    var chat = await _userChatRepository.GetAsync(c => c.User1Id == connection.UserId || c.User2Id == connection.UserId);
                    if (chat != null)
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chat.ChatId.ToString());
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }

    public record UserConnection(int UserId, string UserName);
}
