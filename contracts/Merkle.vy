testNum:public(uint256)

@pure
@internal
def verify(proof:DynArray[bytes32, 100], root:bytes32, leaf:bytes32) -> (bool, uint256):
    computedHash:bytes32 = leaf
    index:uint256 = 0
    for p in proof: 
        index *= 2
        if (convert(computedHash, uint256) <= convert(p, uint256)):
            #Hash(current computed hash + current element of the proof)
            computedHash = keccak256(_abi_encode(computedHash, p))
        else:
            #Hash(current element of the proof + current computed hash)
            computedHash = keccak256(_abi_encode(p, computedHash))
            index += 1
    #Check if the computed hash (root) is equal to the provided root
    return (computedHash == root, index)

@external
def setNum(proof:DynArray[bytes32, 100], root:bytes32, leaf:bytes32):
    isValid:bool = False
    index:uint256 = 0 
    (isValid, index) = self.verify(proof, root, leaf)
    if isValid:
        self.testNum = index