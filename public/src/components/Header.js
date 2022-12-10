const Header = (props) => {
  const [inputValue, setInputValue] = React.useState('');
  const category = new URLSearchParams(location.search).get('category');
  return (
    <React.Fragment>
      <div className="header">
      <div className='title'>Spotiland</div>
      <hr className="collectionhr"></hr>
      <div className='signin'> Signin </div>
    </div>
    </React.Fragment>

  );
}