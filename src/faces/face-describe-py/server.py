# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The Python implementation of the GRPC helloworld.Greeter server."""
import os
import random
import time
import traceback
import logging
from concurrent import futures
from os.path import join, dirname
from dotenv import load_dotenv

import grpc

import kuruvi_pb2
import kuruvi_pb2_grpc

from logger import getJSONLogger
logger = getJSONLogger('face-describe-server')

import facenet

_ONE_DAY_IN_SECONDS = 60 * 60 * 24
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


class Greeter(kuruvi_pb2_grpc.FaceDescribeServicer):

    def describeFaces(self, request, context):
        # base_dir = join('/srv/album-faces', request.albumName)
        base_dir = join('/srv/album-faces', 'test-images')
        print("describe faces called", base_dir)
        facenet.main(base_dir)
        return kuruvi_pb2.FacePoints(points=[1.1, 1.2, 1.3])


def serve():
    port = os.environ.get("FACE_DESCRIBE_PORT")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    kuruvi_pb2_grpc.add_FaceDescribeServicer_to_server(Greeter(), server)
    logger.info("listening on port: " + port)
    server.add_insecure_port('[::]:'+port)
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    logging.basicConfig()
    serve()
