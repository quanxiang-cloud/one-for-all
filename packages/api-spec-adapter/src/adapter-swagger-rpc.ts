import { AjaxConfig, FetchParams, Res } from '.';
import SwaggerSpecAdapter from './adapter-swagger';

export default class SwaggerRPCSpecAdapter extends SwaggerSpecAdapter {
  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const ajaxConfig = SwaggerSpecAdapter.prototype.build.call(this, apiID, fetchParams);

    if (ajaxConfig) {
      ajaxConfig.headers = { ...ajaxConfig.headers, 'x-proxy': 'API' };
    }

    return ajaxConfig;
  }

  responseAdapter = ({ data, error }: Res): Res => {
    if (error || !data) {
      return { data, error };
    }

    if (data.code !== 0) {
      const e = new Error(data.msg);
      if (data.data) {
        Object.assign(e, { data: data.data });
      }
      return { data: undefined, error: e };
    }

    return { data: data.data, error: undefined };
  }
}
