// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStateConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiCallStatus: apiStateConstants.initial,
    productDetails: {},
    count: 1,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onSuccess = data => {
    // console.log(data)
    this.displayProductDetails(data)
    this.setState({
      productDetails: data,
      errorMsg: '',
    })
  }

  onFailure = msg => {
    // console.log(msg)
    this.setState({
      productDetails: {},
      errorMsg: msg,
    })
  }

  onClickDecrease = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  displayLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    // console.log(similarProducts)

    let similarProductsItem
    if (similarProducts !== undefined) {
      const modifiedSimilarProducts = similarProducts.map(eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        similarProducts: eachItem.similar_products,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }))
      similarProductsItem = (
        <>
          <h1> Similar Products </h1>
          <ul className="similar-products-container">
            {modifiedSimilarProducts.map(eachItem => (
              <SimilarProductItem eachProduct={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </>
      )
    } else {
      similarProductsItem = null
    }

    return similarProductsItem
  }

  displayProductDetails = () => {
    // console.log(data)
    const {productDetails, count} = this.state
    // console.log(productDetails)

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    // console.log(similarProducts)
    return (
      <>
        <div className="product-details">
          <img src={imageUrl} className="product-img" alt="product" />
          <div className="product-data">
            <h1> {title} </h1>
            <p> Rs {price}/- </p>
            <div className="rating-review">
              <div className="rating">
                <p>{rating}</p>
                <img
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  className="rating-star-img"
                />
              </div>
              <p> {totalReviews} Reviews</p>
            </div>
            <p className="description"> {description} </p>
            <p> Available: {availability} </p>
            <p> Brand: {brand} </p>
            <hr className="line-brk" />
            <div className="no-of-items">
              <button
                type="button"
                onClick={this.onClickDecrease}
                className="count-btn"
                data-testid="minus"
              >
                <BsDashSquare />
              </button>

              <p> {count}</p>
              <button
                type="button"
                onClick={this.onClickIncrease}
                className="count-btn"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              {' '}
              Add to cart{' '}
            </button>
          </div>
        </div>
        {this.getSimilarProducts()}
      </>
    )
  }

  onCLickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  displayFailureView = () => {
    const {errorMsg} = this.state
    return (
      <div className="error-container">
        <img
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="error-img"
        />
        <h1>{errorMsg} </h1>
        <button
          type="button"
          className="error-btn"
          onClick={this.onCLickContinueShopping}
        >
          {' '}
          Continue Shopping{' '}
        </button>
      </div>
    )
  }

  getProductDetails = async () => {
    this.setState({
      apiCallStatus: apiStateConstants.loading,
    })
    const {match} = this.props
    const {url} = match
    const jwtToken = Cookies.get('jwt_token')
    const reqUrl = `https://apis.ccbp.in${url}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(reqUrl, options)

    const data = await response.json()
    if (response.ok) {
      const modifiedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      // console.log(modifiedData)
      this.setState({
        apiCallStatus: apiStateConstants.success,
      })
      this.onSuccess(modifiedData)
    } else {
      this.setState({
        apiCallStatus: apiStateConstants.failure,
      })
      this.onFailure(data.error_msg)
    }
  }

  displayComponent = () => {
    const {apiCallStatus} = this.state

    switch (apiCallStatus) {
      case apiStateConstants.success:
        return this.displayProductDetails()
      case apiStateConstants.failure:
        return this.displayFailureView()
      case apiStateConstants.loading:
        return this.displayLoaderView()
      default:
        return <h1> name </h1>
    }
  }

  render() {
    // console.log(reqData)

    return (
      <>
        <Header />
        <div className="product-details-container">
          {this.displayComponent()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
