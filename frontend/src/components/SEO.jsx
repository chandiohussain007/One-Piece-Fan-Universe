import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
  const siteTitle = 'One Piece Fan Universe';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  const defaultDescription = 'Immerse yourself in epic storytelling, powerful characters, and a universe driven by dreams, freedom, and adventure. Explore the best One Piece Fan Universe today!';
  const metaDescription = description || defaultDescription;

  const defaultKeywords = 'One Piece, Anime Fandom Universe, Fandom related searches, Read Manga Online, Fan Art, Anime Universe, Straw Hat';
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const defaultImage = 'https://1piecefandom.netlify.app/images/1345309.jpeg'; // Main hero image
  const metaImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
