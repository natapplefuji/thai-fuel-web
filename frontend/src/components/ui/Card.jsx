import styles from './Card.module.css';

export default function Card({ children, className = '', highlighted = false, flat = false, style }) {
  const classes = [
    styles.card,
    highlighted ? styles.highlighted : '',
    flat ? styles.flat : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
