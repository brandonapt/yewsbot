import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import { container } from '@sapphire/framework';

export class UserRoute extends Route {
  public constructor(context: Route.LoaderContext, options: Route.Options) {
    super(context, {
      ...options,
      route: 'api/health'
    });
  }

  public [methods.GET](_request: ApiRequest, response: ApiResponse) {
    response.json({ message: 'all good!', status: 'ok', uptime: container.client.uptime });
  }
}