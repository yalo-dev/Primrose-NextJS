import { useState } from 'react';

const useFilter = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  return { searchTerm, setSearchTerm, selectedAge, setSelectedAge, selectedTopic, setSelectedTopic };
};

export default useFilter;
