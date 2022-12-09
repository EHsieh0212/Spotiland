function Sendemail(){
    const [email, setEmail] = React.useState('');

    async function submit(){
      await api.sendEmail({email: email})
      .then((json) => {
        if (json.error){
          window.alert(JSON.stringify(json.error))
        } else{
          window.alert(JSON.stringify(json.msg))
          window.localStorage.setItem("jwt", json.jwt)
        }
      })
    }
    return (
        <div className="profile">
        <div>     
        <h1>重新設定密碼</h1>
            <input type="mail" id="username" name="mail" onChange={(e) => setEmail(e.target.value)}  placeholder="請輸入信箱" required></input>
            <div>
            <button className="submit" onClick={submit}>Send</button>
          </div>
    </div>
    </div>
    )
}

function App() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return (
      <React.Fragment>
        <Header cartItems={cart} />
        <Sendemail />
        <Footer />
      </React.Fragment>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector('#root'));