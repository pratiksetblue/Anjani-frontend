"use client";
export default function BackToTop() {
  return <div dangerouslySetInnerHTML={{ __html: "<div class=\"progress-wrap\">\n<svg class=\"progress-circle svg-content\" height=\"100%\" viewbox=\"-1 -1 102 102\" width=\"100%\">\n<path d=\"M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98\"></path>\n</svg>\n<svg class=\"arrow\" height=\"25\" viewbox=\"0 0 24 23\" width=\"22\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M0.556131 11.4439L11.8139 0.186067L13.9214 2.29352L13.9422 20.6852L9.70638 20.7061L9.76793 8.22168L3.6064 14.4941L0.556131 11.4439Z\"></path>\n<path d=\"M23.1276 11.4999L16.0288 4.40105L15.9991 10.4203L20.1031 14.5243L23.1276 11.4999Z\"></path>\n</svg>\n</div>" }} />;
}
