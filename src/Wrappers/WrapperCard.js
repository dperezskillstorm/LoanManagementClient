import styled from 'styled-components'

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: 20;
    display: flex;
    margin-top: 2px;
   

  }

  .container{
    display: flexbox;
    flex-wrap:   wrap;
    align-self: center;

  }

  .loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

  .card{
    width: 33%;
    min-width: max-content;
      padding: 20px;
      border: 1px solid #c9c9c9;
  }

.infobox{
  display: flexbox;
  flex-direction: column;
  min-width: max-content;
}

.infobox div{
  margin-right:5px;
  font-weight: 700;
}


  .card li {
    background-color: lightblue;
  }

  .card-title{
    background-color: gold;
    height: 40px;
    padding: 10px;
    text-align: center;
  }

  .footer {
    display: flexbox;
  }


  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display:none;
    
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display:flex;

      height:50hv;
    }
  }
  .btn{
    width: 290px;
    margin-left: 5px;

  }
`
export default Wrapper
