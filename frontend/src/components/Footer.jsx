import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <div>
            NEON_HORIZON
          </div>
          <p>
            Elevating the anime experience through cinematic design and community-driven content.
          </p>
        </div>
        <div>
          <h5>Universe</h5>
          <ul>
            <li><Link to="/manga">Original Manga</Link></li>
            <li><Link to="/videos">Streaming</Link></li>
            <li><Link to="/fanart">Creators Hub</Link></li>
            <li><Link to="#">The Vault</Link></li>
          </ul>
        </div>
        <div>
          <h5>Community</h5>
          <ul>
            <li><Link to="#">Discord</Link></li>
            <li><Link to="/fanart">Fan Art Arena</Link></li>
            <li><Link to="#">Events</Link></li>
            <li><Link to="#">Merchandise</Link></li>
          </ul>
        </div>
        <div>
          <h5>Connect</h5>
          <div>
            <a href="#">
              <span>public</span>
            </a>
            <a href="#">
              <span>videocam</span>
            </a>
            <a href="#">
              <span>campaign</span>
            </a>
          </div>
        </div>
      </div>
      <div>
        <p>© 2024 NEON_HORIZON ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        <div>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
