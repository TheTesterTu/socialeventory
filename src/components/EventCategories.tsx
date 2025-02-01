interface EventCategoriesProps {
  categories: string[];
}

export const EventCategories = ({ categories }: EventCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <span 
          key={cat} 
          className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary"
        >
          {cat}
        </span>
      ))}
    </div>
  );
};