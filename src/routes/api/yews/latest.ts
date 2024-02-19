import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import { client } from '../../../db/redis';
import bulkGetArticles from '../../../web/goons/bulkFetchArticles';

export class UserRoute extends Route {
  public constructor(context: Route.LoaderContext, options: Route.Options) {
    super(context, {
      ...options,
      route: 'api/yews/latest'
    });
  }

  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    const latestHeadline = await client.get('latest-yews-headline');
    const split = latestHeadline.split('/')[2];

    const yews = await bulkGetArticles(split, true);
    const obj = {
      date: split,
      articles: yews
    };

    response.json({ message: "here ya go! use it wisely.", status: 'ok', yews: obj });
  }
}