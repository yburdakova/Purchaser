import React from 'react'
import { FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer>
      <a className="footer_contact" href="tel:+1234567890">
        <div className="headerIcon footerIcon shake">
          <FiPhone />
        </div>
        <div className="">Связаться с администратором</div>
      </a>
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