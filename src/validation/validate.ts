import { parse } from '../swagger/swagger-parser';
import { Rules } from '../rules/rules';
import { handleRules } from '../rules/handle-rules';

type DefaultRules = {
  [P in keyof Required<Rules>]: boolean;
};

const defaultRules: DefaultRules = {
  "must-contain-domain-and-context": true,
  "must-contain-port": true,
  "must-contain-server-url": true,
  "must-contain-version": true,
  "no-singular-resource": true
};

/**
 * Parses and validates the api based on the informed rules
 * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition.
 * @param rules The rules object to deactive rule validation
 * @returns A Promise of an array of RuleFault
 */
export const validate = async (api: string, rules?: Rules) => {
  const parsedApi: any = await parse(api);

  if (parsedApi.swagger) {
    return Promise.reject(Error('This is not using OpenAPI 3.0.0^'));
  }

  const parsedRules: Rules = {
    ...defaultRules,
    ...rules
  };

  return Promise.resolve(handleRules(parsedApi, parsedRules));
};
