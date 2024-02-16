import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import yewsSchema from '../../../db/schemas/yews.schema';
import { client } from '../../../db/redis';

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
    console.log(split);

    const yews = await yewsSchema.find({ date: split });

    response.json({ message: "here ya go! use it wisely.", status: 'ok', yews: yews[0] });
  }
}