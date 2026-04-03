import React from 'react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section>
      <div>
        <div></div>
      </div>
      <div>
        <h2>Become part of the <span>Legend.</span></h2>
        <p>Join thousands of creators and fans in the most advanced anime ecosystem on the web. Exclusive content, early access, and more.</p>
        <div>
          <Link to="/register">
            Get Early Access
          </Link>
          <Link to="/about">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
