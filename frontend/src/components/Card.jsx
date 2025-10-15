import React from 'react';

const Card = ({ title, subtitle, image, children }) => (
    <div className="border rounded shadow p-4 max-w-xs">
        {image && <img src={image} alt={title} className="w-full h-48 object-cover mb-2 rounded" />}
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        <div className="mt-2">{children}</div>
    </div>
);

export default Card;
