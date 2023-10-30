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
            array.push(randomIntFromInterval(5, 620));
        }
        this.setState({ array, highlights: [], sorted: [] });
    }

    checkArrayOrder(arr) {
        let isAscending = true;
        let isDescending = true;
    
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                isAscending = false;
            }
            if (arr[i] > arr[i - 1]) {
                isDescending = false;
            }
        }
    
        if (isAscending) {
            return "ascending";
        } else if (isDescending) {
            return "descending";
        } else {
            return "unsorted";
        }
    }  

    async handleMergeSort() {
        const order = this.checkArrayOrder(this.state.array);
        if (order === "ascending" && this.state.ascendingOrder) {
            await this.resetArray();
        } else if (order === "descending" && !this.state.ascendingOrder) {
            await this.resetArray();
        }
        this.setState({ sorted: [], highlights: [] });
        
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
            const shouldMergeFromLeft = this.state.ascendingOrder ? L[i] <= R[j] : L[i] >= R[j];
            
            if (shouldMergeFromLeft) {
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
        const arrayOrder = this.checkArrayOrder(this.state.array);
        if ((arrayOrder === "ascending" && this.state.ascendingOrder) ||
            (arrayOrder === "descending" && !this.state.ascendingOrder)) {
            await this.resetArray();
        }
        this.setState({ sorted: [], highlights: [] });
        const array = this.state.array.slice();
        await this.quickSort(array, 0, array.length - 1, this.state.ascendingOrder);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async quickSort(arr, low = 0, high = arr.length - 1, ascendingOrder = true) {
        if (low < high) {
            let pi = await this.partition(arr, low, high, ascendingOrder);
    
            await this.quickSort(arr, low, pi - 1, ascendingOrder);
            await this.quickSort(arr, pi + 1, high, ascendingOrder);
        }
    }
    
    async partition(arr, low, high, ascendingOrder) {
        let pivot = arr[high];
        let i = (low - 1);
    
        for (let j = low; j < high; j++) {
            this.setState({ highlights: [i, j] });  // Highlight the elements being compared
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
            const shouldSwap = ascendingOrder ? arr[j] < pivot : arr[j] > pivot;
    
            if (shouldSwap) {
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
        const currentOrder = this.checkArrayOrder(this.state.array);
        const desiredOrder = this.state.ascendingOrder ? "ascending" : "descending";
        this.setState({ sorted: [], highlights: [] });
        // If array is already sorted in the desired order, reset it
        if (currentOrder === desiredOrder) {
            await this.resetArray();
        }
        
        const array = this.state.array.slice();
        await this.heapSort(array, desiredOrder);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }

    async heapify(arr, n, i, order) {
        let largestOrSmallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        // Highlight nodes being compared
        this.setState({ highlights: [i, left, right] });
        await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
        
        const comparison = (a, b) => {
            if (order === "ascending") {
                return a > b;  // Max-heap for ascending
            } else {
                return a < b;  // Min-heap for descending
            }
        };
        
        if (left < n && comparison(arr[left], arr[largestOrSmallest])) {
            largestOrSmallest = left;
        }
        
        if (right < n && comparison(arr[right], arr[largestOrSmallest])) {
            largestOrSmallest = right;
        }
        
        if (largestOrSmallest !== i) {
            [arr[i], arr[largestOrSmallest]] = [arr[largestOrSmallest], arr[i]];
        
            // Highlight swapped elements
            this.setState({ array: arr, highlights: [i, largestOrSmallest] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
        
            await this.heapify(arr, n, largestOrSmallest, order);
        }
    }

    async heapSort(arr, order) {
        const n = arr.length;
    
        // Build the heap (rearrange the array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(arr, n, i, order);
        }
    
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            
            // Highlight swapped elements
            this.setState({ array: arr, highlights: [0, i] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));
    
            await this.heapify(arr, i, 0, order);
        }
    }

    async bubbleSort() {
        const order = this.checkArrayOrder(this.state.array);
        this.setState({ sorted: [], highlights: [] });
        // If the array is already sorted in the desired order, reset it
        if ((order === "ascending" && this.state.ascendingOrder) || 
            (order === "descending" && !this.state.ascendingOrder)) {
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
        const currentOrder = this.checkArrayOrder(this.state.array);
        this.setState({ sorted: [], highlights: [] });
        if ((this.state.ascendingOrder && currentOrder === "ascending") || (!this.state.ascendingOrder && currentOrder === "descending")) {
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
    
            // Highlight the element being compared
            this.setState({ highlights: [i, j] });
            await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
            // Use a function to determine whether to shift, based on the current sort order
            const shouldShift = (j) => {
                if (this.state.ascendingOrder) {
                    return j >= 0 && arr[j] > key;
                } else {
                    return j >= 0 && arr[j] < key;
                }
            };
    
            while (shouldShift(j)) {
                arr[j + 1] = arr[j];
                j--;
    
                // Highlight the shifted element
                this.setState({ array: arr, highlights: [j + 1] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
            }
    
            arr[j + 1] = key;
            this.setState({ array: arr });
        }
    }    

    async handleSelectionSort() {
        const currentOrder = this.checkArrayOrder(this.state.array);
        const desiredOrder = this.state.ascendingOrder ? "ascending" : "descending";
        this.setState({ sorted: [], highlights: [] });
        if (currentOrder === desiredOrder) {
            await this.resetArray();
        }
    
        const array = this.state.array.slice();
        await this.selectionSort(array, desiredOrder);
        this.setState({ sorted: Array.from({ length: array.length }, (_, index) => index), highlights: [] });
    }
    
    async selectionSort(arr, desiredOrder) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let optimalIdx = i;
    
            for (let j = i + 1; j < n; j++) {
                // Highlight the elements being compared
                this.setState({ highlights: [optimalIdx, j] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));  // Delay for visualization
    
                const isOptimal = desiredOrder === "ascending" 
                    ? arr[j] < arr[optimalIdx] 
                    : arr[j] > arr[optimalIdx];
    
                if (isOptimal) {
                    optimalIdx = j;
                }
            }
    
            // Swap the found optimal element with the first element
            if (optimalIdx !== i) {
                [arr[i], arr[optimalIdx]] = [arr[optimalIdx], arr[i]];
    
                // Highlight swapped elements
                this.setState({ array: arr, highlights: [i, optimalIdx] });
                await new Promise(resolve => setTimeout(resolve, this.state.sortSpeed));
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
                    <div class="slider-container">
                        <label>Array Size: {this.state.arraySize}</label>
                        <input 
                            class="custom-slider"
                            type="range" 
                            min="5" 
                            max="500" 
                            value={this.state.arraySize} 
                            onChange={this.handleArraySizeChange}
                        />
                    </div>

                    <div class="slider-container">
                        <label>Sorting Speed (ms): {this.state.sortSpeed}</label>
                        <input 
                            class="custom-slider"
                            type="range" 
                            min="1" 
                            max="100" 
                            value={this.state.sortSpeed} 
                            onChange={this.handleSortSpeedChange}
                        />
                    </div>
                    <button onClick={this.toggleSortingOrder}>Sorting Order (Currently {this.state.ascendingOrder ? "Ascending" : "Descending"})</button>
                    <button onClick={() => this.resetArray()}>New Array</button>
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