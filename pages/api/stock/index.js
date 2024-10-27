import { PrismaClient } from '@prisma/client';
 
import { getToken } from "next-auth/jwt";



const prisma = new PrismaClient();



export default async function handler(req, res) {

   
    if (req.method !== 'GET') {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    

  const { id, page, pageSize, sortField = 'id', sortOrder = 'asc', filterField, filterValue } = req.query;

  let skip, take;
  if (page && pageSize) {
      skip = (parseInt(page) - 1) * parseInt(pageSize);
      take = parseInt(pageSize);
  }

  const relationColumnsData = [{"columnName":"productId","relationModel":"product","relationModelKey":"name","isSelfRelation":false},{"columnName":"product","relationModel":"product","relationModelKey":"name","isSelfRelation":false}];
  
  let where = {};
  
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filterField_')) {
      const index = key.split('_')[1];
      const filterField = req.query[`filterField_${index}`];
      const filterValue = req.query[`filterValue_${index}`];
  
      if (filterField && filterValue) {
        const isRelationField = Array.isArray(relationColumnsData) && relationColumnsData.some(column => filterField === column.columnName);
  
        if (isRelationField) {
          relationColumnsData.forEach((column) => {
            if (filterField === column.columnName) {
              if (column.isSelfRelation) {
                where[column.columnName] = {
                  [column.relationModelKey]: {
                    contains: filterValue,
                    mode: 'insensitive'
                  }
                };
              } else {
                where[column.relationModel.toLowerCase()] = {
                  [column.relationModelKey]: {
                    contains: filterValue,
                    mode: 'insensitive'
                  }
                };
              }
            }
          });
        } else {
          
            if (filterField === "id") {
                if ("Int" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("Int" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("Int" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "quantity") {
                if ("Int" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("Int" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("Int" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
        }
      }
    }
  });
  
  let orderBy = {};
  if (sortField) {
    const isRelationField = Array.isArray(relationColumnsData) && relationColumnsData.some(column => sortField === column.columnName);
  
    if (isRelationField) {
      
        if (sortField === 'productId') {
          
            orderBy['product'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
        if (sortField === 'product') {
          
            orderBy['product'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
    } else {
      orderBy[sortField] = sortOrder === 'ascend' ? 'asc' : 'desc';
    }
  }

  const idCondition = 
    
      
        Number(id)  
      
    
  
    
  ;

  switch (req.method) {
    case 'GET':
      try {
        if (id) {
          const result = await prisma.stock.findUnique({
            where: { id: idCondition },
            
              include: {
                
                    
                        
                            product: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                },
              
          });
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ error: "stock not found" });
          }
        } else {
          const results = await prisma.stock.findMany({
            skip,
            take,
            orderBy,
            where,
            
              include: {
                
                    
                        
                            product: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                },
              
          });
          const totalCount = await prisma.stock.count({ where });
          res.status(200).json({ data: results, pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: totalCount,
          }});
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching stock" });
      }
      break;

      case 'POST':
      try {
        const postData = { ...req.body };
        
        
    
        const newStock = await prisma.stock.create({
          data: {
            ...postData,
            
            
              
                    
                    
                
            
              
                    
                    
                
            
        }
        });
        res.status(201).json(newStock);
      } catch (error) {
        res.status(500).json({ error: "Error creating stock" });
      }
      break;
    
      case 'PUT':
      try {
        const putData = { ...req.body };
    
        const existingRecord = await prisma.stock.findUnique({
          where: { id: idCondition }
        });
    
        if (!existingRecord) {
          return res.status(404).json({ error: "stock not found" });
        }
    
        
    
    
        const updatedStock = await prisma.stock.update({
          where: { id: idCondition },
          data: {
            ...putData,
            
            
              
                    
                    
                
            
              
                    
                    
                
            
        }
        });
    
        res.status(200).json(updatedStock);
      } catch (error) {
        res.status(500).json({ error: "Error updating stock" });
      }
      break;

    case 'DELETE':
      try {
        const existingRecord = await prisma.stock.findUnique({
          where: { id: idCondition }
        });

        

        await prisma.stock.delete({
          where: { id: idCondition },
        });
        res.status(200).json({ message: "stock deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting stock" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}