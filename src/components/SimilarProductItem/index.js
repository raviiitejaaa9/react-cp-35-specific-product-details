// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  // console.log(eachProduct)
  const {imageUrl, title, brand, price, rating} = eachProduct

  return (
    <li className="product-item">
      <img
        className="similar-product-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <p> {title} </p>
      <p> by {brand} </p>
      <div className="rating-review">
        <p className="similar-price"> Rs {price} </p>
        <div className="rating">
          <p>{rating}</p>
          <img
            className="rating-star-img"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
