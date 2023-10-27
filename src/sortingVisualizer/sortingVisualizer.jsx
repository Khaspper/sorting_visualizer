import React from 'react'
import './sortingVisualizer.css';

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            highlights: [], // Array to store highlighted indices
            sorted: [] // Checks to see if array is sorted and changes color to green
        };
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        //Change the 100 to the scroll
        //! Size of the array
        for (let i = 0; i < 100; i++) {
            array.push(randomIntFromInterval(5, 730));
        }
        this.setState({
            array, highlights: [], sorted: []
        });
    }

    async mergeSort(startIndex = 0, endIndex = this.state.array.length - 1) {
        // Retrieve the total length of the array from the component's state.
        const length = this.state.array.length;
    
        // Base case: if the portion to be sorted has a size of 1 or 0, return immediately.
        if (startIndex >= endIndex) {
            return;
        }
    
        // Calculate the middle index of the current portion.
        const middleIndex = Math.floor((startIndex + endIndex) / 2);
    
        // Recursively sort the left half of the current portion.
        await this.mergeSort(startIndex, middleIndex);
        // Recursively sort the right half of the current portion.
        await this.mergeSort(middleIndex + 1, endIndex);
    
        // Merge the two sorted halves.
        await this.merge(startIndex, middleIndex, endIndex);
    
        // If we're sorting the entire array (not just a sub-portion),
        // mark the whole array as sorted and remove any highlights.
        if (startIndex === 0 && endIndex === this.state.array.length - 1) {
            this.setState({ 
                // Create an array of indices representing the sorted state.
                sorted: Array.from({ length: length }, (_, index) => index),
                // Reset the highlights.
                highlights: [] 
            });
        }
    }
    
    async merge(startIndex, middleIndex, endIndex) {
        let left = startIndex;
        let right = middleIndex + 1;
        let temp = [];
    
        // Start a loop where we iterate as long as both 'left' and 'right' pointers are within their respective bounds.
        while (left <= middleIndex && right <= endIndex) {
            
            // Set the current elements at 'left' and 'right' positions to be highlighted.
            this.setState({ highlights: [left, right] });

            // Introduce a short pause (0.01 milliseconds) for visualization purposes.
            // This can be useful in animations to show comparisons between the two elements.
            await new Promise(resolve => setTimeout(resolve, .01));

            // Compare the elements at 'left' and 'right' positions in the array.

            // If the element at 'left' is smaller, add it to the 'temp' array and move the 'left' pointer forward.
            if (this.state.array[left] < this.state.array[right]) temp.push(this.state.array[left++]);
            // Otherwise, add the element at 'right' to the 'temp' array and move the 'right' pointer forward.
            else temp.push(this.state.array[right++]);
        }
    
        while (left <= middleIndex) {
            temp.push(this.state.array[left++]);
        }
        while (right <= endIndex) {
            temp.push(this.state.array[right++]);
        }
    
        for (let i = 0; i < temp.length; i++) {
            this.state.array[startIndex + i] = temp[i];
            this.setState({ array: this.state.array });
    
            // Highlight the current position being filled
            this.setState({ highlights: [startIndex + i] });
            //! Speed change this later
            await new Promise(resolve => setTimeout(resolve, .01));
        }
    
        this.setState({ highlights: [] }); // Clear highlights
    }

    testSortingAlgorithms() {
        for (let i = 0; i < 1; i++) {
            const array = [];
            for (let j = 0; i < randomIntFromInterval(1, 1000); i++) {
                array.push(randomIntFromInterval(-1000, 1000));
            }
            const javaScriptedArray = array.slice().sort((a, b) => a - b);
            const mergeSortedArray = this.mergeSort(array.slice());
            console.log(arraysAreEqual(javaScriptedArray, mergeSortedArray));
        }
    }

    render() {
        const {array} = this.state;

        return (
            <div className='parent'>
                <div className='nav-bar'>
                    <button onClick={() => this.resetArray()}>Generate New Array</button>
                    <button onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button onClick={() => this.testSortingAlgorithms()}>Test Sort Algo</button>
                </div>
                <div className='bar-holder'>
                    {array.map((value, idx) => (
                        <div 
                         className='array-bar'
                         key={idx} 
                         style={{height: `${value}px`}}>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function arraysAreEqual(arr1, arr2) {
    // Check if lengths are different
    if (arr1.length !== arr2.length) return false;

    console.log(arr1, arr2)
    // Check content equality
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}