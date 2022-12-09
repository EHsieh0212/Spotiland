function Signup(){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  async function submit(){
    await api.signup({
      name:name,
      email:email,
      password:password
    }).then((json)=>{if(json.error){
      window.alert(json.error)
    }else{
      alert("註冊成功")
      window.location.href="/profile.html"
    }} 
    ).catch(error=>window.alert(error))
  }
    return (
        <div className="profile">
        <div style={{textAlign:"center", marginBottom:"0px"}} className="mt-5">
        <h1>註冊頁面</h1>
              <div>帳號:
                <input type="mail" id="username" name="mail" onChange={(e) => setEmail(e.target.value)}  placeholder="請輸入信箱" required></input>
                </div>
              <div>密碼:
              <input type="password" id="username" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="請輸入密碼" required></input>
              </div>
              <div>姓名:
              <input type="text" id="username" name="name" onChange={(e) => setName(e.target.value)} placeholder="請輸入姓名" required></input>
              </div>
              <div>
              <button class="submit" onClick={submit}>Signup</button>
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
        <Signup />
        <Footer />
      </React.Fragment>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector('#root'));