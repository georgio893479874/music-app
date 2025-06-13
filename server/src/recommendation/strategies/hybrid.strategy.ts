import { Injectable } from '@nestjs/common';
import { ContentBasedStrategy } from './content-based.strategy';
import { CollaborativeStrategy } from './collaborative.strategy';

@Injectable()
export class HybridStrategy {
  constructor(
    private readonly content: ContentBasedStrategy,
    private readonly collaborative: CollaborativeStrategy,
  ) {}

  async generate(userId: string, limit: number) {
    const contentRecs = await this.content.generate(userId, limit);
    const collabRecs = await this.collaborative.generate(userId, limit);

    const all = [...contentRecs, ...collabRecs];
    const uniqueMap = new Map<string, typeof all[0]>();

    for (const track of all) {
      uniqueMap.set(track.id, track);
    }

    return [...uniqueMap.values()].slice(0, limit);
  }
}