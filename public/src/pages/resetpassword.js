function Resetpassword(){
    const [password, setPassword] = React.useState('');
    const [confirm, setConfirm] = React.useState('');
    async function submit(){
      if(password!==confirm){
          window.alert("Different Password Inputed.")
      }
      else{
        await api.resetPassword(password, window.localStorage.getItem("jwt"))
        .then((json) => {
          if (json.error){
            window.alert(JSON.stringify(json.error))
          } else{
            window.alert(JSON.stringify(json.msg))
            window.location.assign("/profile.html")
          }
        })
      }
    }
    return (
        <div className="profile">
        <div  className="mt-5">
        <h1>設定新密碼</h1>
        <div>重設密碼:
              <input type="password" id="username"  onChange={(e) => setPassword(e.target.value)} placeholder="請輸入新密碼" required></input>
              </div>
        <div>確認密碼:
            <input type="password" id="username" onChange={(e) => setConfirm(e.target.value)} placeholder="確認新密碼" required></input>
        </div>
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
        <Resetpassword />
        <Footer />
      </React.Fragment>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector('#root'));