var ICON_SIZE = 150;
var PADDING = 20;
var model = {
  cursor: {
    x: 0,
    y: 0
  },
  columns: {
   "5.5x": {
      index: 0,
      title: "webkit-5.55",
      selectedIndex: 0,
      active: false,
      icon: 'gamepad',
      items: [{ title: "webkit-5.50", subtitle: "beta(84Ciss)", active: false, icon: "lock", expage: "5.5x/5.50.html" }, { title: "webkit-5.53", subtitle: "beta(84Ciss)", active: false, icon: "lock", expage: "5.5x/5.53.html" }, { title: "webkit-5.55", subtitle: "beta(84Ciss)", active: false, icon: "lock", expage: "5.5x/5.55.html" }, { title: "webkit-6.00", subtitle: "beta(84Ciss)", active: false, icon: "lock", expage: "5.5x/6.00.html" }]
    },
	"MEDIA": {
      index: 1,
      title: "MEDIA",
      selectedIndex: 0,
      active: false,
      icon: "subscriptions",
      items: [{title: "MP4PLAYER", subtitle: "1.0(DEFAULTDNB)", active: false, icon: "airplay", expage: "payloads/playerloader.html" }]
	},
	"CACHE": {
      index: 2,
      title: "CACHE",
      selectedIndex: 0,
      active: false,
      icon: "copyright",
      items: [{ title: "HOST_CACHE", subtitle: "1.0(Al-Azif)", active: false, icon: "weekend", expage: "payloads/xmbcache.html" }, { title: "USBCACHE_INSTALL", subtitle: "10.0(Stooged)", active: false, icon: "beenhere", expage: "payloads/usbcacheinstall.html" }, { title: "CACHE_INSTALL", subtitle: "10.0(Stooged)", active: false, icon: "book", expage: "payloads/cacheinstall.html" }, { title: "APPLICATION_CACHE", subtitle: "2.0(Hotdogwithmustard)", active: false, icon: "loyalty", expage: "payloads/applicationcache.html" }, { title: "HISTORY_BLOCKER", subtitle: "2.0(Stooged)", active: false, icon: "bookmarks", expage: "payloads/history.html" }]
	},
	"★DEBUG": {
      index: 3,
      title: "★DEBUG",
      selectedIndex: 0,
      active: false,
      icon: "cake",
      items: [{ title: "★PAYLOAD", subtitle: "(QUICK_TESTING)", active: false, icon: "healing", expage: "payloads/testloader.html" }]
	},
  }
  //add zero position to each column and item
};_.each(model.columns, function (c) {
  c.position = { x: 0, y: 0 };
  _.each(c.items, function (i) {
    i.position = {
      x: 0,
      y: 0
    };
  });
});

var xmbVue = new Vue({
  el: "#xmb",
  data: model,
  methods: {
    handleKey: function handleKey(dir, val) {
      this.cursor[dir] += val;
      var nCols = this.nColumns;

      // wrap x
      this.cursor.x = this.cursor.x % nCols;
      if (this.cursor.x < 0) {
        this.cursor.x = this.cursor.x + nCols;
      }

      //wrap y
      var nRows = this.nRows;
      this.cursor.y = this.cursor.y % nRows;
      if (this.cursor.y < 0) {
        this.cursor.y = this.cursor.y + nRows;
      }

      this.highlightCell(this.cursor.x, this.cursor.y);
    },
    highlightCell: function highlightCell(column, row) {

      console.log(column, row);
      //update position of elements as well
      var xAccum = (-column - 1) * (ICON_SIZE + PADDING);
      if (column == 0) {
        xAccum += ICON_SIZE + PADDING;
      }
      var yAccum;

      _.each(this.columns, function (col, colKey) {
        col.active = false;
        yAccum = -(ICON_SIZE + PADDING) * (row + 1);

        col.position.x = xAccum;
        xAccum += ICON_SIZE + PADDING;
        if (column === col.index || column === col.index + 1) {
          xAccum += ICON_SIZE / 2;
        }

        _.each(col.items, function (item, rowN) {
          if (rowN == row && col.index == column) {
            item.active = true;
            col.active = true;
          } else {
            item.active = false;
          }

          if (rowN == row) {
            yAccum += ICON_SIZE + PADDING;
          }
          yAccum += ICON_SIZE + PADDING;
          item.position.y = yAccum;
        });
      });
      this.cursor.y = row;
      this.cursor.x = column;
    }
  },
  watch: {
    cursor: function cursor(e) {
      console.log('cursor mutated', e);
    }
  },
  computed: {
    nColumns: function nColumns() {
      return Object.keys(this.columns).length;
    },
    nRows: function nRows() {
      //get the row at the current index
      var row = this.columnsArray[this.cursor.x];
      if (!row) {
        console.log('invalid row index: ', this.cursor.x);
        return 0;
      }
      return row.items.length; //todo: number of columns in this row
    },
    columnsArray: function columnsArray() {
      var _this = this;

      //get columns in an array
      var arr = [];
      Object.keys(this.columns).forEach(function (key) {
        arr.push(_this.columns[key]);
      });
      return _.sortBy(arr, 'index');
    }
  },
  created: function created() {
    _.each(this.columns, function (column) {
      _.each(column.items, function (item) {
        item.active = false;
      });
    });
    this.highlightCell(this.cursor.x, this.cursor.y);
  }
});

/* // handle movement based on keys
$('body').on('keypress', function (e) {
  if (e.key == "ArrowUp") {
    xmbVue.handleKey('y', -1);
  } else if (e.key == "ArrowDown") {
    xmbVue.handleKey('y', 1);
  } else if (e.key == "ArrowLeft") {
    xmbVue.handleKey('x', -1);
  } else if (e.key == "ArrowRight") {
    xmbVue.handleKey('x', 1);
  }
}); */

$('body').on("mousewheel", _.debounce(scrollHandler, 20));

function scrollHandler(e) {
  console.log(e);
  if (e.deltaX) {
    xmbVue.handleKey('x', Math.sign(e.deltaX));
  }
  if (e.deltaY) {
    xmbVue.handleKey('y', Math.sign(e.deltaY));
  }
}
// REMAP TO D-PAD EXPERIMENTAL
// 114 = options, 116 = L1, 117 = R1
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if (key == 37) {
   xmbVue.handleKey('x', -1);
   } else if (key == 39) {
   xmbVue.handleKey('x', 1);
   } else if (key  == 38) {
   xmbVue.handleKey('y', -1);
   } else if (key  == 40) {
   xmbVue.handleKey('y', 1);
   }
};