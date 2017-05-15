/*
 * @module PageObject
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */


export class PageObject {
  
  "use strict"

  constructor() {
    
    this.prev       = null;
    this.next       = null;
    this.head       = null;
    this.tail       = null;
    this.length     = 0;
    //this.elements = [];
    
    this.Node = function( el ) {
      this.element  = el;
      this.next     = null;
      this.prev     = null;
    }
  }
  
  append( element ) {

        let node = new this.Node( element ),
            current;

        if ( this.head === null) { //first node in list
            this.head   = node;
            this.tail   = node;
        } else {

            //attach to the tail node
            this.tail.next  = node;
            node.prev       = this.tail;
            this.tail       = node;
        }

        this.length++; //update size of list
    } 
  

  insert( position, element ) {

        //check for out-of-bounds
        if ( position >= 0 && position <= this.length ) {

            let node    = new this.Node( element ),
                current = this.head,
                previous,
                index   = 0;

            if ( position === 0 ) { //add on first position

                if ( !this.head ) {
                    this.head = node;
                    this.tail = node;
                } else {
                    node.next     = current;
                    current.prev  = node;
                    this.head     = node;
                }

            } else  if ( position === this.length ) {

                current       = this.tail;
                current.next  = node;
                node.prev     = current;
                this.tail     = node;

            } else {
                while ( index++ < position ) {
                    previous  = current;
                    current   = current.next;
                }
                node.next     = current;
                previous.next = node;

                current.prev  = node;
                node.prev     = previous;
            }

            this.length++;

            return true;

        } else {
            return false;
        }
    }


    removeAt( position ) {

        //check for out-of-bounds values
        if ( position > -1 && position < this.length ) {

            let current = this.head,
                previous,
                index   = 0;

            //remove first item
            if ( position === 0 ) {

                this.head = current.next;

                //if there is only one item, then we update tail as well //NEW
                if ( this.length === 1 ) {
                    this.tail   = null;
                } else {
                    this.head.prev = null;
                }

            } else if ( position === this.length-1 ) {

                current         = this.tail;
                this.tail       = current.prev;
                this.tail.next  = null;

            } else {

                while ( index++ < position ) {

                    previous  = current;
                    current   = current.next;
                }

                //link previous with current's next - skip it to remove
                previous.next     = current.next;
                current.next.prev = previous;
            }

            this.length--;

            return current.element;

        } else {
            return null;
        }
    }

  remove( element ) {

    let index = this.indexOf( element );
    return this.removeAt( index );
  }


  indexOf( element ){

        let current = this.head,
            index   = -1;

        //check first item
        if ( element == current.element.id ) {
            return 0;
        }

        index++;

        //check in the middle of the list
        while( current.next ) {

            if ( element == current.element.id ) {
                return index;
            }

            current = current.next;
            index++;
        }

        //check last item
        if ( element == current.element.id ) {
            return index;
        }

        return -1;
  }


  isEmpty() {
    return this.length === 0;
  };

  size() {
    return this.length;
  };

  toString(){
    let current = this.head,
        s       = current ? [current.element] : []; //'';

    while( current && current.next ) {
      current = current.next;
      //s += ', ' + current.element;
      s.push( current.element );
    }

    return s;
  }

  print() {
    console.log( this.toString() );
  }
  
  dump(){
      return this.toString();
  }
  
  dumpPage( p ) {
    try {
        
      let current = this.head
        , arr     = Number( current.element.page_no ) == Number( p ) ? [current.element] : [];

      while( current.next ) {

        current = current.next;

        if ( Number( current.element.page_no ) == Number( p ) ) {

          arr.push( current.element )
        }
      }
      return arr;

    } catch (e) {
      ;
    }
  }
  
  getHead(){
    return this.head;
  }

  getTail(){
    return this.tail;
  }

}