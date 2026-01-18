export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    ...props
}) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white rounded-xl shadow-md
        ${paddings[padding]}
        ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}
