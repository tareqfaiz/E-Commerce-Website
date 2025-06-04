import React from 'react';

function About() {
  return (
    <section className="about-section" style={{
      padding: '60px 20px',
      backgroundColor: '#f8fafc',
      margin: '20px 0',
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            About Afrin's Store
          </h2>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '0 auto',
            borderRadius: '2px',
          }}></div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'stretch',
        }}>
          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '28px' }}>🛍️</span>
              Our Story
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6b7280',
              marginBottom: '16px',
            }}>
              Welcome to Afrin's Store, your premier destination for quality fashion and lifestyle products. 
              Founded with a passion for bringing you the latest trends and timeless classics, we've been 
              serving customers with dedication and style.
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6b7280',
            }}>
              Our carefully curated collection features everything from casual wear to formal attire, 
              ensuring you find the perfect piece for every occasion.
            </p>
          </div>

          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '28px' }}>🎯</span>
              Our Mission
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6b7280',
              marginBottom: '16px',
            }}>
              To provide high-quality, affordable fashion that empowers our customers to express 
              their unique style and personality. We believe that great style should be accessible 
              to everyone.
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6b7280',
            }}>
              We're committed to excellent customer service, fast shipping, and a seamless 
              shopping experience that keeps you coming back.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '50px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            Why Choose Us?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>✨</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Quality Products
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Carefully selected items that meet our high standards for quality and style.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>🚚</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Fast Shipping
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Quick and reliable delivery to get your orders to you as soon as possible.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>💝</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Great Value
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Competitive prices without compromising on quality or service.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>🤝</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Customer Support
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Friendly and helpful customer service team ready to assist you.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>🔒</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Secure Shopping
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Safe and secure payment processing with SSL encryption for your protection.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>🔄</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Easy Returns
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                Hassle-free return policy within 30 days if you're not completely satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
