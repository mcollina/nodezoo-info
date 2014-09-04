/* Copyright (c) 2014 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
"use strict";


var lru = require('lru-cache')



module.exports = function info( options ){
  var seneca = this

  options = seneca.util.deepextend({
    size: 99999,
    wait: 222
  },options)


  var info_cache = lru( options.size )


  seneca.add(
    'role:info,cmd:get', 
    {
      name:   { required$:true, string$:true },
    }, 
    cmd_get)


  seneca.add(
    'role:info,req:part', 
    { 
      name: { required$:true, string$:true },
    },
    req_module)


  seneca.add(
    'role:info,res:part', 
    { 
      name: { required$:true, string$:true },
    },
    res_module)



  function cmd_get( args, done ) {
    var seneca  = this

    var name = args.name
    seneca.act('role:info,req:part',{name:name})

    setTimeout(function(){
      
      var data = info_cache.get( name )
      done(null,data)

    },options.wait)
  }

  
  function req_module( args, done ) {
    done()
  }


  function res_module( args, done ) {
    var name = args.name
    
    var data = info_cache.get( name ) || {}
    data[ args.part ] = args.data
    info_cache.set( name, data )

    done()
  }
  
}
