function Product(props) {
  const [product, setProduct] = React.useState();
  const [selectedColorCode, setSelectedColorCode] = React.useState();
  const [selectedSize, setSelectedSize] = React.useState();
  const [star,setStar]=React.useState();
  const [quantity, setQuantity] = React.useState(1);
  const [status,setStatus]=React.useState(0);
  var jwtToken = localStorage.getItem("jwtToken");
  React.useEffect(() => {
    const id = new URLSearchParams(location.search).get('id');
        api.getProduct(id).then((json) => {
          setSelectedColorCode(json.data.colors[0].code);
          setProduct(json.data)});
        api.getstar(id).then((json) => {setStar(json[1])})
  }, []);

  React.useEffect(() => {
    api.getProfile(jwtToken).then((json) => {
      var id = [];
      api.getCollection(json["data"]["email"]).then((data)=>{
        for(var i=0;i<data.length;i++){
          id.push(data[i]["product_id"])
          console.log(data[i]["product_id"])
        }
        console.log(product.id)
        if(id.indexOf(product.id)!=(-1)){
          setStatus(1)
        }else{
          setStatus(0)
        }
      })
      })
  }, [product]);
console.log(status)
  let avg;
  if(star){
      avg=star.average
      avg=Math.round(avg)
  }
  if(!product) return(
    <div className="product">
      <div className="product__notfound">查無此產品</div>
    </div>
  );
  
  function getStock(colorCode, size) {
    return product.variants.find(
      (variant) => variant.color_code === colorCode && variant.size === size
    ).stock;
  }

 
  function renderProductColorSelector() {
    return (
      <div className="product__color-selector">
        {product.colors.map((color) => (
          <div
            key={color.code}
            className={`product__color${
              color.code === selectedColorCode
                ? ' product__color--selected'
                : ''
            }`}
            style={{ backgroundColor: `#${color.code}` }}
            onClick={() => {
              setSelectedColorCode(color.code);
              setSelectedSize();
              setQuantity(1);
            }}
          />
        ))}
      </div>
    );
  }

  function renderProductSizeSelector() {
    return (
      <div className="product__size-selector">
        {product.sizes.map((size) => {
          const stock = getStock(selectedColorCode, size);
          return (
            <div
              key={size}
              className={`product__size${
                size === selectedSize ? ' product__size--selected' : ''
              }${stock === 0 ? ' product__size--disabled' : ''}`}
              onClick={() => {
                if (stock === 0) return;
                setSelectedSize(size);
                if (stock < quantity) setQuantity(1);
              }}
            >
              {size}
            </div>
          );
        })}
      </div>
    );
  }

  function renderProductQuantitySelector() {
    return (
      <div className="product__quantity-selector">
        <div
          className="product__quantity-minus"
          onClick={() => {
            if (!selectedSize) return;
            if (quantity === 1) return;
            setQuantity(quantity - 1);
          }}
        />
        <div className="product__quantity-value">{quantity}</div>
        <div
          className="product__quantity-add"
          onClick={() => {
            if (!selectedSize) return;
            const stock = getStock(selectedColorCode, selectedSize);
            if (quantity === stock) return;
            setQuantity(quantity + 1);
          }}
        />
      </div>
    );
  }

  function addToCart() {
    if (!selectedSize) {
      window.alert('請選擇尺寸');
      return;
    }
    const newCartItems = [
      ...props.cartItems,
      {
        color: product.colors.find((color) => color.code === selectedColorCode),
        id: product.id,
        image: product.main_image,
        name: product.title,
        price: product.price,
        qty: quantity,
        size: selectedSize,
        stock: getStock(selectedColorCode, selectedSize),
      },
    ];
    window.localStorage.setItem('cart', JSON.stringify(newCartItems));
    props.setCartItems(newCartItems);
    window.alert('已加入購物車');
  }

  

  function getavgstar(){
    let star=[]
    let notstar=[]
    for(let i=0;i<avg;i++){
      star[i]=i
    }
    for(let i=0;i<5-avg;i++){
      notstar[i]=i
    }
    console.log(notstar)
    const statusHtml= Array.isArray(star) ? star.map((star,index)=>
        <span className="fa fa-star" style={{fontSize:"20px",marginTop:"18px",marginRight:"3px", color:"orange"}}></span>
      ):[];
      const statusHtml1= Array.isArray(notstar) ? notstar.map((notstar,index)=>
      <span className="fa fa-star-o" style={{fontSize:"20px",marginRight:"3px", color:"orange"}}></span>
    ):[];
  return(
    <div className="rating2">
      評價：
          {statusHtml}
          {statusHtml1}
    </div>
  )}

  function addToCollection(){
    if(!jwtToken){
      window.location.assign("./profile.html")
      return;
    }
    if(status==0){
      api.getProfile(jwtToken).then((json) => {
      api.addCollection(json["data"]["email"],product.id)
          window.alert("已加入收藏清單!")
          setStatus(1)
      })
    }else{
      api.getProfile(jwtToken).then((json) => {
      api.deleteCollection(json["data"]["email"],product.id)
      window.alert("已移除此商品")
      setStatus(0)
      })
    } 
  }
      return (
        <div className="product">
          <img src={product.main_image} className="product__main-image" />
          <div className="product__detail">
            <div className="product__title">{product.title}</div>
            <div className="product__id">{product.id}</div>
            <div className="product__price">TWD.{product.price}
          {status==0 && <div className="icon-favorite" onClick={addToCollection}/>}       
          {status==1 && <div className="icon-favorite1" onClick={addToCollection}/>} 

            </div>
            <div className="product__variant">
              <div className="product__color-title">顏色｜</div>
              {renderProductColorSelector()}
            </div>
            <div className="product__variant">
              <div className="product__size-title">尺寸｜</div>
              {renderProductSizeSelector()}
            </div>
            <div className="product__variant">
              <div className="product__quantity-title">數量｜</div>
              {renderProductQuantitySelector()}
            </div>
            <button className="product__add-to-cart-button" onClick={addToCart}>
              {selectedSize ? '加入購物車' : '請選擇尺寸'}
            </button>
            <div className="product__note">{product.note}</div>
            <div className="product__texture">{product.texture}</div>
            <div className="product__description">{product.description}</div>
            <div className="product__place">素材產地 / {product.place}</div>
            <div className="product__place">加工產地 / {product.place}</div>
            <div className='avgstar'>
            {/* {avg} */}
              {getavgstar()}
            </div>
          </div>
          <div className="product__story">
            <div className="product__story-title">評論區</div>
            <div className="comment col-12 ">
                            <Comment product={product}/>   
                  </div>
              </div>
          <div className="product__story">
            <div className="product__story-title">細部說明</div>
            <div className="product__story-content">{product.story}</div>
          </div>
          <div className="product__images">
            {product.images.map((image, index) => (
              <img src={image} className="product__image" key={index} />
            ))}
          </div>
        </div>
      );
}

function App() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const [cartItems, setCartItems] = React.useState(cart);
  return (
    <React.Fragment>
      <Header cartItems={cartItems} />
      <Product cartItems={cartItems} setCartItems={setCartItems} />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
