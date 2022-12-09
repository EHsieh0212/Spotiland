function Favorite() {
    const [collection, setCollection] = React.useState([]);
    const [email, setEmail] = React.useState('');
    React.useEffect(() => {
        var jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            window.location.assign('./profile.html');
            return;
        }
        api.getProfile(jwtToken).then((json) => {
            setEmail(json['data']['email']);
            api.getCollection(json['data']['email']).then((data) => {
                setCollection(data);
            });
        });
    }, []);

    function remove(product_id) {
        api.deleteCollection(email, product_id);
        window.alert('已移除此商品');
        window.location.reload();
    }

    // console.log(collection);

    if (collection.length != 0) {
        var collections = collection.map((collection, index) => (
            <div className="favarea">
                <div className="fav">
                    <a className="favlink" key={collection.product_id} href={`./product.html?id=${collection.product_id}`}>
                        <img src={'http://54.248.96.206/assets/' + collection.product_id + '/main.jpg'} className="product__main-image" />
                        <div className="favdetail">
                            <div className="favname">{collection.title}</div>
                            <div className="favid">{collection.product_id}</div>
                            <div className="favprice">TWD.{collection.price}</div>
                        </div>
                    </a>
                    <div className="favremove" onClick={() => remove(collection.product_id)}>
                        <div className="favtrash" />
                    </div>
                </div>
            </div>
        ));

        return (
            <React.Fragment>
                <div className="favorite">
                    <div className="collection">Your Collections</div>
                    <hr className="collectionhr"></hr>
                    <div className="favor">{collections}</div>
                </div>
            </React.Fragment>
        );
    } else {
        return null;
    }
}

function App() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const [cartItems, setCartItems] = React.useState(cart);
    return (
        <React.Fragment>
            <Header cartItems={cartItems} />
            <Favorite />
            <Footer />
        </React.Fragment>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
