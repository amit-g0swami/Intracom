import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceUnavailableException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationRepository } from '../repositories/conversation.repository';
import { VisitorsService } from '../../visitors/visitors.service';

describe('ChatService', () => {
  let service: ChatService;

  const messageRepositoryMock = {
    save: jest.fn(),
    getConversationHistory: jest.fn(),
    toDto: jest.fn((message) => ({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      isAdmin: message.isAdmin,
      createdAt: message.createdAt,
    })),
  };

  const conversationRepositoryMock = {
    listInbox: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
    ensureExists: jest.fn(),
    linkVisitor: jest.fn(),
  };

  const visitorsServiceMock = {
    trackFromMessage: jest.fn(),
  };

  beforeEach(async () => {
    process.env.FEATURE_CHAT_API = 'true';
    process.env.FEATURE_CHAT_PERSISTENCE = 'true';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: MessageRepository,
          useValue: messageRepositoryMock,
        },
        {
          provide: ConversationRepository,
          useValue: conversationRepositoryMock,
        },
        {
          provide: VisitorsService,
          useValue: visitorsServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(ChatService);
  });

  it('returns chat status', () => {
    expect(service.getStatus()).toEqual({
      chatApiEnabled: true,
      chatPersistenceEnabled: true,
    });
  });

  it('lists conversations from repository', async () => {
    conversationRepositoryMock.listInbox.mockResolvedValue([
      {
        id: 'conv-1',
        appId: 'default',
        status: 'open',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        messages: [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            senderId: 'visitor',
            text: 'Hello',
            isAdmin: false,
            createdAt: new Date('2026-01-02T00:00:00.000Z'),
          },
        ],
        _count: { messages: 1 },
      },
    ]);

    const result = await service.listConversations({ limit: 10 });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('conv-1');
    expect(result[0].lastMessage?.text).toBe('Hello');
  });

  it('throws when chat API is disabled', async () => {
    process.env.FEATURE_CHAT_API = 'false';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: MessageRepository, useValue: messageRepositoryMock },
        { provide: ConversationRepository, useValue: conversationRepositoryMock },
        { provide: VisitorsService, useValue: visitorsServiceMock },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    const disabledService = module.get(ChatService);

    await expect(disabledService.listConversations({ limit: 10 })).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
