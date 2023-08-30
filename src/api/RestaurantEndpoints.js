import { get } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function getRestaurants(){
  return get('restaurants')
}

function getPopularProducts(){
  return get('/products/popular')
}

export { getAll, getDetail, getRestaurantCategories, getRestaurants, getPopularProducts }
