import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import yewsSchema from '../../../db/schemas/yews.schema';

export class UserRoute extends Route {
  public constructor(context: Route.LoaderContext, options: Route.Options) {
    super(context, {
      ...options,
      route: 'api/yews/fetch'
    });
  }

  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    const yews = await yewsSchema.find({})
    response.json({ message: "here ya go! use them wisely.", status: 'ok', yews: yews });
  }
}