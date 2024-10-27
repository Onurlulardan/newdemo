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

  const relationColumnsData = [{"columnName":"products","relationModel":"product","relationModelKey":"name","isSelfRelation":false},{"columnName":"categoryParentId","relationModel":"category","relationModelKey":"name","isSelfRelation":true},{"columnName":"parentcategory","relationModel":"category","relationModelKey":"name","isSelfRelation":true},{"columnName":"childrencategory","relationModel":"category","relationModelKey":"name","isSelfRelation":true}];
  
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
          
            if (filterField === "name") {
                if ("String" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("String" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("String" === 'DateTime') {
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
      
        if (sortField === 'products') {
          
            orderBy['product'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
        if (sortField === 'categoryParentId') {
          
            orderBy['categoryParentId'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
        if (sortField === 'parentcategory') {
          
            orderBy['parentcategory'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
        if (sortField === 'childrencategory') {
          
            orderBy['childrencategory'] = {
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
          const result = await prisma.category.findUnique({
            where: { id: idCondition },
            
              include: {
                
                    
                        
                            products: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                    
                        parentcategory: true,
                    
                
                    
                        childrencategory: true,
                    
                
                },
              
          });
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ error: "category not found" });
          }
        } else {
          const results = await prisma.category.findMany({
            skip,
            take,
            orderBy,
            where,
            
              include: {
                
                    
                        
                            products: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                    
                        parentcategory: true,
                    
                
                    
                        childrencategory: true,
                    
                
                },
              
          });
          const totalCount = await prisma.category.count({ where });
          res.status(200).json({ data: results, pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: totalCount,
          }});
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching category" });
      }
      break;

      case 'POST':
      try {
        const postData = { ...req.body };
        
        
    
        const newCategory = await prisma.category.create({
          data: {
            ...postData,
            
            
              
                    
                    
                        ...(postData.products?.length ? {
                            products: {
                                connect: postData.products.map((item) => ({ id: item })),
                            }
                        } : {}),
                    
                
            
              
                categoryParentId: postData.categoryParentId || null,
              
            
              
                    
                    
                
            
              
                    
                    
                
            
        }
        });
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ error: "Error creating category" });
      }
      break;
    
      case 'PUT':
      try {
        const putData = { ...req.body };
    
        const existingRecord = await prisma.category.findUnique({
          where: { id: idCondition }
        });
    
        if (!existingRecord) {
          return res.status(404).json({ error: "category not found" });
        }
    
        
    
    
        const updatedCategory = await prisma.category.update({
          where: { id: idCondition },
          data: {
            ...putData,
            
            
              
                    
                    
                        ...(putData.products?.length ? {
                            products: {
                                set: putData.products.map((item) => ({ id: item }))
                            }
                        } : {
                            products: {
                                set: [] 
                            }
                        }),
                    
                
            
              
                categoryParentId: putData.categoryParentId || null,
              
            
              
                    
                    
                
            
              
                    
                    
                
            
        }
        });
    
        res.status(200).json(updatedCategory);
      } catch (error) {
        res.status(500).json({ error: "Error updating category" });
      }
      break;

    case 'DELETE':
      try {
        const existingRecord = await prisma.category.findUnique({
          where: { id: idCondition }
        });

        

        await prisma.category.delete({
          where: { id: idCondition },
        });
        res.status(200).json({ message: "category deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting category" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}