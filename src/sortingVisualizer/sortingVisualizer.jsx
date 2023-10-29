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
            // Kept saying Line 94:13:  Do not mutate state directly. Use setState()
            // But can't figure out how to make merge sort work without this code
            this.state.array[startIndex + i] = temp[i];
            this.setState({ array: this.state.array });
    
            // Highlight the current position being filled
            this.setState({ highlights: [startIndex + i] });
            //! Speed change this later
            await new Promise(resolve => setTimeout(resolve, .01));
        }
    
        this.setState({ highlights: [] }); // Clear highlights
    }

    async quickSort(startIndex = 0, endIndex = this.state.array.length - 1) {
        let length = this.state.array.length;
        if (startIndex < endIndex) {
            const pivotIndex = await this.partition(startIndex, endIndex);
            await this.quickSort(startIndex, pivotIndex - 1);
            await this.quickSort(pivotIndex + 1, endIndex);
        }
        if (startIndex === 0 && endIndex === this.state.array.length - 1) {
            this.setState({ sorted: Array.from({ length: length }, (_, index) => index), highlights: [] });
        }
    }
    
    async partition(startIndex, endIndex) {
        const array = this.state.array.slice();
        const pivot = array[endIndex];
        let pivotIndex = startIndex;
    
        for (let i = startIndex; i < endIndex; i++) {
            this.setState({ highlights: [i, endIndex] }); // Highlighting current index and pivot
            await new Promise(resolve => setTimeout(resolve, .01));
    
            if (array[i] < pivot) {
                // swap elements array[i] and array[pivotIndex]
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                this.setState({ array: array, highlights: [i, pivotIndex] });
                await new Promise(resolve => setTimeout(resolve, 50));
                pivotIndex++;
            }
        }
        // swap elements array[pivotIndex] and array[endIndex]
        [array[pivotIndex], array[endIndex]] = [array[endIndex], array[pivotIndex]];
        this.setState({ array: array, highlights: [pivotIndex] });
        await new Promise(resolve => setTimeout(resolve, .01));
    
        return pivotIndex;
    }

    async insertionSort() {
        const array = this.state.array.slice();
        let n = array.length;
    
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
    
            // Highlight the current bar being inserted
            this.setState({ highlights: [i] });
            await new Promise(resolve => setTimeout(resolve, 50));
    
            while (j >= 0 && array[j] > key) {
                // Highlight the bars that are being compared
                this.setState({ highlights: [j, i] });
                await new Promise(resolve => setTimeout(resolve, 50));
    
                array[j + 1] = array[j];
                j = j - 1;
                
                // Update the state after shifting the bar
                this.setState({ array });
                await new Promise(resolve => setTimeout(resolve, .01));
            }
    
            array[j + 1] = key;
            // Update the state after inserting the bar to its correct position
            this.setState({ array });
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    
        // Once the sorting is done, update the `sorted` state to turn all bars green
        this.setState({ sorted: Array.from({ length: n }, (_, index) => index), highlights: [] });
    }

    async selectionSort() {
        const array = this.state.array.slice();
        let n = array.length;
    
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
    
            // Highlight the current minIndex
            this.setState({ highlights: [minIndex] });
            await new Promise(resolve => setTimeout(resolve, 50));
    
            for (let j = i + 1; j < n; j++) {
                // Highlight the bars that are being compared
                this.setState({ highlights: [minIndex, j] });
                await new Promise(resolve => setTimeout(resolve, 50));
    
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                    // Update the highlighted bar if a new minIndex is found
                    this.setState({ highlights: [minIndex] });
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
    
            if (minIndex !== i) {
                // Swap the found minimum element with the first element
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                // Update the state after the swap
                this.setState({ array });
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    
        // Once the sorting is done, update the `sorted` state to turn all bars green
        this.setState({ sorted: Array.from({ length: n }, (_, index) => index), highlights: [] });
    }

    testSortingAlgorithms() {
        for (let i = 0; i < 1; i++) {
            const array = [];
            for (let j = 0; j < randomIntFromInterval(1, 1000); j++) {
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
                    <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <button onClick={() => this.insertionSort()}>Insertion Sort</button>
                    <button onClick={() => this.selectionSort()}>Selection Sort</button>
                    <button onClick={() => this.testSortingAlgorithms()}>Test Sort Algo</button>
                </div>
                <div className='bar-holder'>
                    {array.map((value, idx) => (
                          <div 
                          className='array-bar'
                          key={idx} 
                          style={{height: `${value}px`,
                          //! Highlights the bars that are being compared
                          backgroundColor: this.state.sorted.includes(idx) ? 'green' : 
                                 this.state.highlights.includes(idx) ? 'red' : '#2196F3'}}>
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