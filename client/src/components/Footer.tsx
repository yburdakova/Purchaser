import React from 'react'
import { FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer>
      <div className="footer_contact">
        <a href="tel:+1234567890" className="headerIcon shake">
          <FiPhone />
        </a>
        <div className="">Связаться с администратором</div>
      </div>
      <div className="">
        <div className="">
          © 2024 ООО "Поставка"
        </div>
        <a className="dev_link" href='https://burdakova.com/' target='_blank' >
          Разработка сайта - Burdakova.com
        </a>
      </div>
      

    </footer>
  )
}

export default Footer