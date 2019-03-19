const index = async (req, res) => {
    res.status(404).send({ payload: { message: 'Resource not found' } });
  };
  
  export default index;