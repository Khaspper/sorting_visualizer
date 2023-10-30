import React from 'react'
import './sortingVisualizer.css';

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            highlights: [], // Array to store highlighted indices
            sorted: [], // Checks to see if array is sorted and changes color to green
            arraySize: 50,     // Default size
            sortSpeed: 10,      // Default speed (e.g., 10ms)
            ascendingOrder: true,
        };
    }

    toggleSortingOrder = () => {
        this.setState(prevState => ({ ascendingOrder: !prevState.ascendingOrder }));
    }

    componentDidMount() {
        this.resetArray();
    }

    handleArraySizeChange = (e) => {
        const newSize = e.target.value;
        this.setState({ arraySize: newSize }, this.resetArray);
    }
    
    handleSortSpeedChange = (e) => {
        const newSpeed = e.target.value;
        this.setState({ sortSpeed: newSpeed });
    }

    resetArray() {
        const array = [];
        for (let i = 0; i < this.state.arraySize; i++) {
            array.push(randomIntFromInterval(5, 730));
        }
        this.setState({ array, highlights: [], sorted: [] });
    }

    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    async handleMergeSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.mergeSort(array, 0, array.length - 1);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async mergeSort(arr, left, right) {
        if (left >= right) {
            return;
        }
        let middle = Math.floor((left + right) / 2);
        await this.mergeSort(arr, left, middle);
        await this.mergeSort(arr, middle + 1, right);
        await this.merge(arr, left, middle, right);
    }
    
    async merge(arr, left, middle, right) {
        let n1 = middle - left + 1;
        let n2 = right - middle;
    
        // Temporary arrays
        let L = new Array(n1);
        let R = new Array(n2);
    
        for (let i = 0; i < n1; i++)
            L[i] = arr[left + i];
        for (let j = 0; j < n2; j++)
            R[j] = arr[middle + 1 + j];
    
        // Merge the temp arrays back into arr[left..right]
        let i = 0;
        let j = 0;
        let k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            this.setState({ array: arr, highlights: [k] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
            k++;
        }
    
        // Copy remaining elements of L[], if any
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
    
        // Copy remaining elements of R[], if any
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    async handleQuickSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.quickSort(array);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async quickSort(arr, low = 0, high = arr.length - 1) {
        if (low < high) {
            let pi = await this.partition(arr, low, high);
    
            await this.quickSort(arr, low, pi - 1);
            await this.quickSort(arr, pi + 1, high);
        }
    }
    
    async partition(arr, low, high) {
        let pivot = arr[high];
        let i = (low - 1);
    
        for (let j = low; j < high; j++) {
            this.setState({ highlights: [i, j] });  // Highlight the elements being compared
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.setState({ array: arr, highlights: [i, j] }); // Highlight swapped elements
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.setState({ array: arr, highlights: [i+1, high] });
    
        return i + 1;
    }

    async handleHeapSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.heapSort(array);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async heapSort(arr) {
        const n = arr.length;
    
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(arr, n, i);
        }
    
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];  // Move largest element to end
    
            // Highlight swapped elements
            this.setState({ array: arr, highlights: [0, i] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
            await this.heapify(arr, i, 0);
        }
    }
    
    async heapify(arr, n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
    
        // Highlight nodes being compared
        this.setState({ highlights: [i, left, right] });
        await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
    
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
    
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
            // Highlight swapped elements
            this.setState({ array: arr, highlights: [i, largest] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
            await this.heapify(arr, n, largest);
        }
    }

    async bubbleSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }

        const array = this.state.array.slice();  
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
    
                const shouldSwap = this.state.ascendingOrder ? array[j] > array[j + 1] : array[j] < array[j + 1];
    
                if (shouldSwap) {
                    // swap
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
    
                    this.setState({ 
                        array: array,
                        highlights: [j, j+1]  // Highlight the swapped bars
                    });
                    
                    await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
                } else {
                    this.setState({highlights: []}) // This clears the highlights
                }
            }
        }
        this.setState({ sorted: Array.from({ length: n }, (_, index) => index), highlights: [] });
    }
        

    async handleInsertionSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.insertionSort(array);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async insertionSort(arr) {
        const n = arr.length;
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;

            // Highlight the current element
            this.setState({ highlights: [i] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                
                // Highlight the compared elements
                this.setState({ array: arr, highlights: [j, j+1] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
                
                j = j - 1;
            }
            arr[j + 1] = key;

            this.setState({ array: arr });
        }
    }

    async handleSelectionSort() {
        if (this.isSorted(this.state.array)) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.selectionSort(array);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let optimalIdx = i; // Renaming this to 'optimal' since it can be either 'min' or 'max' based on the sort order
        
            for (let j = i + 1; j < n; j++) {
                // Highlight the elements being compared
                this.setState({ highlights: [optimalIdx, j] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
                
                // Based on the sort order, decide which element is considered 'optimal' (either min or max)
                const shouldSwap = this.state.ascendingOrder ? arr[j] < arr[optimalIdx] : arr[j] > arr[optimalIdx];
    
                if (shouldSwap) {
                    optimalIdx = j;
                }
            }
        
            // Swap the found optimal element with the first element
            if (optimalIdx !== i) {
                [arr[i], arr[optimalIdx]] = [arr[optimalIdx], arr[i]];
        
                // Highlight swapped elements
                this.setState({ array: arr, highlights: [i, optimalIdx] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
            }
        }
    }
    

    //! This is to test my algorithms
    // testSortingAlgorithms() {
    //     for (var i = 0; i < 100; i++) {
    //         var randomArray = [];
    //         for (var k = 0; k < 100; k++) {
    //             randomArray.push(Math.floor(Math.random() * 1000));
    //         }
    
    //         var sortedWithBuiltIn = randomArray.slice().sort(function(a, b) {
    //             return a - b;
    //         });
    //         var sortedWithMergeSort = mergeSort(randomArray.slice());
    
    //         for (var j = 0; j < sortedWithBuiltIn.length; j++) {
    //             if (sortedWithBuiltIn[j] !== sortedWithMergeSort[j]) {
    //                 return false;
    //             }
    //         }
    //     }
    
    //     return true;
    // }

    render() {
        const {array} = this.state;

        return (
            <div className='parent'>
                <div className='nav-bar'>

                    <div>
                        <label>Array Size: {this.state.arraySize}</label>
                        <input 
                            type="range" 
                            min="5" 
                            max="500" 
                            value={this.state.arraySize} 
                            onChange={this.handleArraySizeChange}
                        />
                    </div>

                    <div>
                        <label>Sorting Speed (ms): {this.state.sortSpeed}</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={this.state.sortSpeed} 
                            onChange={this.handleSortSpeedChange}
                        />
                    </div>
                    <button onClick={this.toggleSortingOrder}>Toggle Sorting Order (Currently {this.state.ascendingOrder ? "Ascending" : "Descending"})</button>
                    <button onClick={() => this.resetArray()}>Generate New Array</button>
                    <button onClick={() => this.handleMergeSort()}>Merge Sort</button>
                    <button onClick={() => this.handleQuickSort()}>Quick Sort</button>
                    <button onClick={() => this.handleHeapSort()}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
                    <button onClick={() => this.handleInsertionSort()}>Insertion Sort</button>
                    <button onClick={() => this.handleSelectionSort()}>Selection Sort</button>
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

// function arraysAreEqual(arr1, arr2) {
//     // Check if lengths are different
//     if (arr1.length !== arr2.length) return false;

//     console.log(arr1, arr2)
//     // Check content equality
//     for (let i = 0; i < arr1.length; i++) {
//         if (arr1[i] !== arr2[i]) return false;
//     }

//     return true;
// }