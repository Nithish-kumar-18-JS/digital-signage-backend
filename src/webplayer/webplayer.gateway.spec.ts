import { Test, TestingModule } from '@nestjs/testing';
import { WebplayerGateway } from './webplayer.gateway';

describe('WebplayerGateway', () => {
  let gateway: WebplayerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebplayerGateway],
    }).compile();

    gateway = module.get<WebplayerGateway>(WebplayerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
