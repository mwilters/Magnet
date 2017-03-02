using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Magnet.Models
{
    public class Location
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string PostalZip { get; set; }
        public string City { get; set; }
        public string ProvState { get; set; }
        public string Country { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double Distance { get; set; }
 
        public WaitTime WaitTime { get; set; }
    }
}