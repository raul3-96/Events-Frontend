import { get } from './helpers/ApiRequestsHelper'

function getCouple (id) {
  return get(`couples/${id}`)
}

export { getCouple}
