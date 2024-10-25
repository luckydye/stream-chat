import { Emote, EmoteMap } from './Emote';
import EmoteService from './EmoteService';

let globalEmotes: EmoteMap = {};

export class SevenTVEmote extends Emote {
  static get url_template() {
    return "https://cdn.7tv.app/emote/{{id}}/{{scale}}.webp";
  }
  static get scale_template() {
    return {
      x1: "1x",
      x2: "2x",
      x3: "3x",
    }
  }
}

export default class SevenTVEmotes extends EmoteService {

  static get service_name(): string {
    return "7tv";
  }

  static get global_emotes() {
    return globalEmotes;
  }

  static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
    return fetch("https://7tv.io/v3/emote-sets/global")
      .then(res => res.json())
      .then(data => {
        for (let emote of data.emotes) {
          globalEmotes[emote.name] = new SevenTVEmote(emote);
        }
        return globalEmotes;
      });
  }

  static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
    return fetch(`https://7tv.io/v3/users/twitch/${id}`)
      .then(res => res.json())
      .then(data => {
        const channelEmotes: EmoteMap = {};

        for (let emote of data.emote_set.emotes) {
          channelEmotes[emote.name] = new SevenTVEmote(emote);
        }
        return channelEmotes;
      });
  }

}
