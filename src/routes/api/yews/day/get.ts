import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import yewsSchema from '../../../../db/schemas/yews.schema';

export class UserRoute extends Route {
  public constructor(context: Route.LoaderContext, options: Route.Options) {
    super(context, {
      ...options,
      route: 'api/yews/:date/get'
    });
  }

  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    const date = _request.params.date;
    
    const yews = await yewsSchema.findOne({ date: date })
    
    if (!yews) {
      response.json({ message: "could not find any yews for that date.", status: 'error', dateRequested: date });
      return;
    }

    response.json({ message: "here ya go! use it wisely.", status: 'ok', yews: yews });
  }
}