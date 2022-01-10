import PropTypes from 'prop-types';
import { useState } from 'react';
import s from './Searchbar.module.css';
import { BiSearch } from 'react-icons/bi';

const Searchbar = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  return (
    <header className={s.searchbar}>
      <form className={s.form} onSubmit={handleSubmit}>
        <button type="submit" className={s.button}>
          <BiSearch size={20} />
        </button>

        <input
          className={s.input}
          onChange={handleChange}
          value={value}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
