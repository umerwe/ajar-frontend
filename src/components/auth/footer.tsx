import Link from 'next/link';
import React from 'react'

type FooterProps = {
    messageText: string;
    linkHref: string;
    linkText: string;
};

const Footer = ({ messageText, linkHref, linkText }: FooterProps) => {
    return (
        <div className="text-center text-sm mt-4">
            <span className="text-gray-600 mr-1">{messageText}</span>
            <Link
                href={linkHref}
                className="text-teal-500 hover:text-teal-600 font-medium">
                {linkText}
            </Link>
        </div>
    )
}

export default Footer
