import React from 'react';
import './filterOptions.css'
const FilterOptions: React.FC = () => {
    return (
        <div className="filter-options">
            <div className="option-group">
                Document handover:
                <label><input type="radio" name="document" /> Yes</label>
                <label><input type="radio" name="document" /> No</label>
                <label><input type="radio" name="document" /> No Answer</label>
            </div>
            <div className="option-group">
                Lunch packet taken:
                <label><input type="checkbox" /> Yes</label>
                <label><input type="checkbox" /> No</label>
                <label><input type="checkbox" /> No Answer</label>
            </div>
        </div>
    );
};

export default FilterOptions;
