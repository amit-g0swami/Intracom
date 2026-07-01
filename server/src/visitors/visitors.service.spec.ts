import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorRepository } from './visitor.repository';

describe('VisitorsService', () => {
  const repositoryMock = {
    listVisitors: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    ensureExists: jest.fn(),
    touchLastSeen: jest.fn(),
  };

  beforeEach(() => {
    process.env.FEATURE_VISITORS_API = 'true';
    process.env.FEATURE_CHAT_PERSISTENCE = 'true';
    jest.clearAllMocks();
  });

  it('lists visitors', async () => {
    repositoryMock.listVisitors.mockResolvedValue([
      {
        id: 'visitor-1',
        appId: 'default',
        email: 'guest@example.com',
        name: 'Guest',
        attributes: { plan: 'free' },
        lastSeenAt: new Date('2026-01-02T00:00:00.000Z'),
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        _count: { conversations: 2 },
      },
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        { provide: VisitorRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(VisitorsService);
    const result = await service.listVisitors({ limit: 10 });

    expect(result[0].email).toBe('guest@example.com');
    expect(result[0].conversationCount).toBe(2);
  });

  it('throws when visitor API is disabled', async () => {
    process.env.FEATURE_VISITORS_API = 'false';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        { provide: VisitorRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(VisitorsService);

    await expect(service.listVisitors({ limit: 10 })).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('throws when visitor is missing', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        { provide: VisitorRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(VisitorsService);

    await expect(service.getVisitor('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
