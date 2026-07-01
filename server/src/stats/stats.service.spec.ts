import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';

describe('StatsService', () => {
  const repositoryMock = {
    countMessagesSince: jest.fn(),
    countConversationsByStatus: jest.fn(),
    messagesSince: jest.fn(),
    conversationsSince: jest.fn(),
  };

  beforeEach(() => {
    process.env.FEATURE_STATS_API = 'true';
    jest.clearAllMocks();
  });

  it('returns stats status', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: StatsRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(StatsService);
    expect(service.getStatus()).toEqual({ statsApiEnabled: true });
  });

  it('builds dashboard from repository data', async () => {
    repositoryMock.countMessagesSince.mockResolvedValue(5);
    repositoryMock.countConversationsByStatus
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    repositoryMock.messagesSince.mockResolvedValue([]);
    repositoryMock.conversationsSince.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: StatsRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(StatsService);
    const dashboard = await service.getDashboard();

    expect(dashboard.overview.messagesToday).toBe(5);
    expect(dashboard.statusBreakdown).toEqual([
      { name: 'Open', value: 3 },
      { name: 'Resolved', value: 2 },
    ]);
  });

  it('throws when stats API is disabled', async () => {
    process.env.FEATURE_STATS_API = 'false';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: StatsRepository, useValue: repositoryMock },
      ],
    }).compile();

    const service = module.get(StatsService);

    await expect(service.getDashboard()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
